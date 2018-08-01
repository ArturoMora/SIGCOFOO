namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class comportamientosSind : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.cat_ComportamientosSind", "descripcion", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.cat_ComportamientosSind", "descripcion", c => c.String(maxLength: 255));
        }
    }
}
