namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class faltante : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CH.cat_GradoAcademico", "Secuencia", c => c.Int());
        }
        
        public override void Down()
        {
            //DropColumn("CH.cat_GradoAcademico", "Secuencia");
        }
    }
}
