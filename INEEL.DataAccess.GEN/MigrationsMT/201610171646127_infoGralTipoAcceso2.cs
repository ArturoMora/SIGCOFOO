namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class infoGralTipoAcceso2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTFgeneral", "AccesoTipo", c => c.Int(nullable: false));
            DropColumn("MT.InformeTFgeneral", "Acceso");
        }
        
        public override void Down()
        {
            AddColumn("MT.InformeTFgeneral", "Acceso", c => c.Boolean(nullable: false));
            DropColumn("MT.InformeTFgeneral", "AccesoTipo");
        }
    }
}
