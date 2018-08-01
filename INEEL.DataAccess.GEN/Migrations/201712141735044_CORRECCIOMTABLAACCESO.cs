namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CORRECCIOMTABLAACCESO : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_acceso_modulos_oc", "ocID", c => c.String(maxLength: 20));
            AlterColumn("GEN.tab_acceso_modulos_oc", "modulo", c => c.String(maxLength: 20));
            DropColumn("GEN.tab_acceso_modulos", "ocID");
        }
        
        public override void Down()
        {
            AddColumn("GEN.tab_acceso_modulos", "ocID", c => c.String(maxLength: 20));
            AlterColumn("GEN.tab_acceso_modulos_oc", "modulo", c => c.String());
            DropColumn("GEN.tab_acceso_modulos_oc", "ocID");
        }
    }
}
