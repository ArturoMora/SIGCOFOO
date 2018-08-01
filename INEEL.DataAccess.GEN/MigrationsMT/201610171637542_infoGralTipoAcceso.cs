namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class infoGralTipoAcceso : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTFgeneral", "Acceso", c => c.Boolean(nullable: false));
            DropColumn("MT.InformeTFgeneral", "TipoAcceso");
        }
        
        public override void Down()
        {
            AddColumn("MT.InformeTFgeneral", "TipoAcceso", c => c.Boolean(nullable: false));
            DropColumn("MT.InformeTFgeneral", "Acceso");
        }
    }
}
