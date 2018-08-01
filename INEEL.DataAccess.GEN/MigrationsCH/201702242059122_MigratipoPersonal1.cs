namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigratipoPersonal1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Solicitud", "tipoPersonal_Id", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_Solicitud", "tipoPersonal_Id");
        }
    }
}
