namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambiotipodatoacceso : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.tab_acceso_modulos", "fecha", c => c.DateTime(nullable: false));
            AlterColumn("GEN.tab_acceso_modulos_oc", "fecha", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("GEN.tab_acceso_modulos_oc", "fecha", c => c.String(maxLength: 10));
            AlterColumn("GEN.tab_acceso_modulos", "fecha", c => c.String(maxLength: 10));
        }
    }
}
