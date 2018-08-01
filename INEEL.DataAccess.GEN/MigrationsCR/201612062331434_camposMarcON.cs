namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class camposMarcON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "TituloPropuesta", c => c.String(unicode: false));
            AddColumn("CR.tab_OportunidadNegocios", "PorQueSuspende", c => c.String(unicode: false));
            AddColumn("CR.tab_OportunidadNegocios", "PorQueCancela", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "PorQueCancela");
            DropColumn("CR.tab_OportunidadNegocios", "PorQueSuspende");
            DropColumn("CR.tab_OportunidadNegocios", "TituloPropuesta");
        }
    }
}
